// Run with: npx tsx --test src/tests/pageSettings.check.ts
import assert from 'node:assert/strict';
import { test } from 'node:test';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { PageSettings } from '../models/PageSettings';
import pageSettingsRoutes from '../routes/pageSettings';
import { getJwtSecret } from '../utils/jwt';
import { isPage, validatePageContent } from '../utils/pageSettingsValidation';

const contact = {
    addressLine1: '123 Main Street',
    addressLine2: '',
    phone: '555-1234',
    email: 'hello@example.com',
    officeHours: 'Monday to Friday',
    mapUrl: 'https://example.com/map',
};

test('only supported page names are valid', () => {
    assert.equal(isPage('handbook'), true);
    assert.equal(isPage('contact'), true);
    assert.equal(isPage('other'), false);
    assert.equal(isPage('Handbook'), false);
    assert.equal(isPage('studio-pro'), true);
});

test('Studio Pro accepts a safe website link and uploaded image path', () => {
    const settings = { url: 'https://example.com/register', imageUrl: '/images/123-photo.png' };
    assert.equal(validatePageContent('studio-pro', settings), true);
    assert.equal(validatePageContent('studio-pro', { ...settings, imageUrl: '' }), true);
    for (const url of ['', 'javascript:alert(1)', '//example.com', 'https://']) {
        assert.equal(validatePageContent('studio-pro', { ...settings, url }), false);
    }
    for (const imageUrl of ['/images/../bad.png', '/images/file.svg', 'https://example.com/photo.png']) {
        assert.equal(validatePageContent('studio-pro', { ...settings, imageUrl }), false);
    }
});

test('handbook sections enforce shape, types and size limits', () => {
    assert.equal(validatePageContent('handbook', { sections: [] }), true);
    assert.equal(validatePageContent('handbook', { sections: Array(30).fill({ title: 'x'.repeat(200), body: 'x'.repeat(5000) }) }), true);
    assert.equal(validatePageContent('handbook', { sections: Array(31).fill({ title: '', body: '' }) }), false);
    assert.equal(validatePageContent('handbook', { sections: [{ title: 'x'.repeat(201), body: '' }] }), false);
    assert.equal(validatePageContent('handbook', { sections: [{ title: '', body: 'x'.repeat(5001) }] }), false);
    assert.equal(validatePageContent('handbook', { sections: [{ title: 1, body: '' }] }), false);
    assert.equal(validatePageContent('handbook', { sections: [{ title: '', body: '', extra: true }] }), false);
    assert.equal(validatePageContent('handbook', { sections: [], extra: true }), false);
    assert.equal(validatePageContent('handbook', null), false);
});

test('contact fields and map URLs are strictly validated', () => {
    assert.equal(validatePageContent('contact', contact), true);
    assert.equal(validatePageContent('contact', { ...contact, mapImageUrl: '/images/123-map.png', storefrontImageUrl: '' }), true);
    for (const mapImageUrl of ['https://example.com/image.png', '/images/../bad.png', '/images/file.svg', null]) {
        assert.equal(validatePageContent('contact', { ...contact, mapImageUrl }), false);
    }
    assert.equal(validatePageContent('contact', { ...contact, storefrontImageUrl: '/images/123-photo.jpg' }), true);
    assert.equal(validatePageContent('contact', { ...contact, mapUrl: '' }), true);
    assert.equal(validatePageContent('contact', { ...contact, mapUrl: 'http://example.com' }), true);
    for (const mapUrl of ['javascript:alert(1)', '//example.com', 'https://', ' https://example.com', 'https://example.com/a b', 'x'.repeat(2049)]) {
        assert.equal(validatePageContent('contact', { ...contact, mapUrl }), false);
    }
    for (const [field, max] of Object.entries({ addressLine1: 200, addressLine2: 200, phone: 50, email: 254, officeHours: 500 })) {
        assert.equal(validatePageContent('contact', { ...contact, [field]: 'x'.repeat(max) }), true);
        assert.equal(validatePageContent('contact', { ...contact, [field]: 'x'.repeat(max + 1) }), false);
        assert.equal(validatePageContent('contact', { ...contact, [field]: null }), false);
    }
    const { email, ...missingEmail } = contact;
    assert.equal(validatePageContent('contact', missingEmail), false);
    assert.equal(validatePageContent('contact', { ...contact, extra: true }), false);
});

test('the model uses deterministic string ids in the default database collection', async () => {
    assert.equal(PageSettings.collection.name, 'pagesettings');
    const doc = new PageSettings({ _id: 'handbook', content: { sections: [] } });
    await doc.validate();
    assert.equal(doc._id, 'handbook');
    await assert.rejects(new PageSettings({ _id: 'other', content: {} }).validate());
});

test('HTTP routes authenticate writes, validate input, and return saved content', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/page-settings', pageSettingsRoutes);
    const server = app.listen(0, '127.0.0.1');
    await new Promise<void>((resolve) => server.once('listening', resolve));
    const address = server.address();
    assert.ok(address && typeof address !== 'string');
    const base = `http://127.0.0.1:${address.port}/api/page-settings`;
    const token = jwt.sign({ role: 'admin' }, getJwtSecret());
    const headers = { 'content-type': 'application/json', authorization: `Bearer ${token}` };
    const documents = new Map<string, unknown>();
    const model = PageSettings as any;
    const originalFind = model.findById;
    const originalUpdate = model.findOneAndUpdate;
    const originalReadyState = Object.getOwnPropertyDescriptor(mongoose.connection, 'readyState');
    let readyState = 1;
    Object.defineProperty(mongoose.connection, 'readyState', { configurable: true, get: () => readyState });
    model.findById = (id: string) => ({ lean: async () => documents.has(id) ? { content: documents.get(id) } : null });
    model.findOneAndUpdate = (filter: { _id: string }, update: { $set: { content: unknown } }) => ({
        lean: async () => {
            documents.set(filter._id, update.$set.content);
            return { content: documents.get(filter._id) };
        },
    });

    try {
        let response = await fetch(`${base}/handbook`);
        assert.equal(response.status, 200);
        assert.equal(await response.json(), null);
        response = await fetch(`${base}/contact`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(contact) });
        assert.equal(response.status, 401);
        response = await fetch(`${base}/other`);
        assert.equal(response.status, 400);
        response = await fetch(`${base}/other`, { method: 'PUT', headers, body: JSON.stringify(contact) });
        assert.equal(response.status, 400);
        response = await fetch(`${base}/contact`, { method: 'PUT', headers, body: JSON.stringify({ ...contact, mapUrl: 'javascript:1' }) });
        assert.equal(response.status, 400);
        assert.equal(documents.size, 0);
        response = await fetch(`${base}/contact`, { method: 'PUT', headers, body: JSON.stringify(contact) });
        assert.equal(response.status, 200);
        assert.deepEqual(await response.json(), contact);
        const updated = { ...contact, phone: '555-9876' };
        response = await fetch(`${base}/contact`, { method: 'PUT', headers, body: JSON.stringify(updated) });
        assert.equal(response.status, 200);
        response = await fetch(`${base}/contact`);
        assert.deepEqual(await response.json(), updated);
        assert.equal(documents.size, 1);
        const contactPictures = { ...updated, mapImageUrl: '/images/123-map.png', storefrontImageUrl: '/images/123-photo.jpg' };
        response = await fetch(`${base}/contact`, { method: 'PUT', headers, body: JSON.stringify(contactPictures) });
        assert.equal(response.status, 200);
        response = await fetch(`${base}/contact`);
        assert.deepEqual(await response.json(), contactPictures);
            const studioPro = { url: 'https://example.com/register', imageUrl: '' };
            response = await fetch(`${base}/studio-pro`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(studioPro) });
            assert.equal(response.status, 401);
            response = await fetch(`${base}/studio-pro`, { method: 'PUT', headers, body: JSON.stringify(studioPro) });
            assert.equal(response.status, 200);
            response = await fetch(`${base}/studio-pro`);
            assert.deepEqual(await response.json(), studioPro);
        readyState = 0;
        response = await fetch(`${base}/contact`);
        assert.equal(response.status, 503);
        response = await fetch(`${base}/contact`, { method: 'PUT', headers, body: JSON.stringify(contact) });
        assert.equal(response.status, 503);
    } finally {
        model.findById = originalFind;
        model.findOneAndUpdate = originalUpdate;
        if (originalReadyState) Object.defineProperty(mongoose.connection, 'readyState', originalReadyState);
        else delete (mongoose.connection as any).readyState;
        await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    }
});
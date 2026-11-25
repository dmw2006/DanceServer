export const defaultHandbook = {
  sections: [
    {
      title: 'The Dance Academy Rules & Policies',
      body: `At The Dance Academy we LOVE TO DANCE! We want to share our passion for dance and teaching with our students. Our goal is to create a positive environment for students to have a great learning experience. We want our students to challenge themselves to be the best they can be and work to achieve goals. We encourage students to explore all different styles of dance and find what they love!

Newsletters & Updates - It is your responsibility to stay informed. Please make sure we have a current email address. We send information via email, post to Facebook/Instagram, and hand out hard copies in class.

Dress Code - Hair pulled back for every class, no jeans, only family-friendly wording/graphics. No jewelry except wedding rings and small studs. Ballet: girls pink ballet slippers, leotard, pink tights, hair in a bun. Boys: black slippers, black pants, white tee. Jazz & Tap: black jazz/tap shoes, leggings or dance shorts, athletic top, hair pulled back. Lyrical & Contemporary: half-sole turners/footundies, leggings/shorts, athletic top, hair pulled back. Hip Hop: clean studio-only sneakers, athletic clothing, joggers/baggy sweats, hair pulled back. Tumbling: leotard/shorts or other fitted clothing, barefoot, hair pulled back.

Etiquette - The Dance Academy is a school. Respect teachers, staff, students, parents, property, and equipment. No bad language, bullying, disruptive behavior, or abuse - grounds for immediate dismissal with no refunds. Children not dancing must be supervised. The studio is not responsible for lost, damaged, or stolen property.

Classroom Etiquette - Be on time, prepared, and in dress code. Dancers only in classrooms during class time. No food, soda, or gum; water is encouraged. Phones stay in dance bags during class. Teachers may dismiss students violating rules or dress code.

Student Drop Off and Pick Up - Young dancers must be accompanied in and out by an adult. Notify teachers/front desk if another adult is picking up your child.

Registration Fee & Tuition - Annual registration: $25 per student or $40 per family (non-refundable). 30 min classes $35/mo, 45 min $50/mo, 1 hour $65/mo. Unlimited: single student $190/mo, second family student unlimited $140/mo, family unlimited $390/mo. Tuition is due on the 1st (except December). Payments after the 5th incur a 10% late fee. Auto-pay is available for tuition and dance company fees only. Returned checks: $20 plus late fees. No refunds for paid lessons/fees; no proration for missed classes.

Absences - Please notify the studio. Two consecutive weeks with no notice may be treated as a drop. No refunds or proration for missed classes. Make-up classes are allowed within 4 weeks of the absence.

Snow Days - Call the studio or check Facebook for closures. Emails go out when classes are canceled.

Recital & Costumes - Annual review in early June (date announced in fall). Attendance is vital the two months prior. Costumes range $60-$100; fees are due early December. No refunds once ordered; payment plans may be arranged.`,
    },
    {
      title: 'The Dance Academy Dress Code',
      body: `General - Hair pulled back every class; no jeans; family-friendly graphics only; jewelry is not allowed (wedding rings and small studs are okay).

Ballet - Girls: pink ballet slippers, leotard, pink tights, hair in a bun. Boys: black ballet slippers, black dance pants, white t-shirt.

Jazz & Tap - Black jazz or tap shoes, leggings or dance shorts with athletic tops, hair pulled back.

Lyrical & Contemporary - Half-sole turners or footundies, leggings or dance shorts with athletic tops, hair pulled back.

Hip Hop - Clean sneakers used only for class (no outdoor wear), athletic clothing, joggers or baggy sweats, hair pulled back.

Tumbling - Leotard and shorts or other fitted clothing; dancers are barefoot; hair pulled back.`,
    },
  ],
};

export const defaultContact = {
  addressLine1: '5801 America Lane',
  addressLine2: 'Lakeside, AZ 85929',
  email: 'danceaca@danceacademywhitemountains.com',
  phone: '(928) 537-1406',
  officeHours: 'Mon-Thu 3:30-7:00pm\nFri 11:00am-3:00pm\nSummer hours follow summer classes.',
  mapImageUrl: '',
  storefrontImageUrl: '',
  mapUrl: 'https://www.google.com/maps/place/Dance+Academy/@34.1930403,-110.0566905,14z/data=!4m10!1m2!2m1!1sthedanceacadamyofthewhitemountains!3m6!1s0x8728cba088d32d89:0x16c975e00cea5b9c!8m2!3d34.1930403!4d-110.0185817!15sCih0aGUgZGFuY2UgYWNhZGVteSBvZiB0aGUgd2hpdGUgbW91bnRhaW5zWioiKHRoZSBkYW5jZSBhY2FkZW15IG9mIHRoZSB3aGl0ZSBtb3VudGFpbnOSAQxkYW5jZV9zY2hvb2yaASRDaGREU1VoTk1HOW5TMFZKUTBGblNVTXlkblZpYW1kQlJSQULgAQD6AQQIEhA9!16s%2Fg%2F1tdwkzht?entry=ttu',
};

export function contactPictureUrls(contact, getImageUrl) {
  const defaultAddress = contact.addressLine1 === defaultContact.addressLine1 && contact.addressLine2 === defaultContact.addressLine2;
  return {
    map: contact.mapImageUrl ? getImageUrl(contact.mapImageUrl) : defaultAddress ? '/images/Map.png' : '',
    storefront: contact.storefrontImageUrl ? getImageUrl(contact.storefrontImageUrl) : '/images/gallery1.jpg',
  };
}

export const defaultStudioPro = {
  url: 'https://app.gostudiopro.com/online/index.php?account_id=30387',
  imageUrl: '',
};

export function studioProPreviewUrl(imageUrl, getImageUrl) {
  return imageUrl ? getImageUrl(imageUrl) : '/images/studio-pro-preview.png';
}

#=========================================================================#
# Custom Hestia template: dancesite (HTTP)                                #
# Static files from public_html, everything else to Express on :5000.     #
# Custom templates are not touched by Hestia domain rebuilds or updates.  #
#=========================================================================#

server {
        listen      %ip%:80;
        server_name %domain_idn% %alias_idn%;
        error_log   /var/log/nginx/domains/%domain%.error.log error;

        include %home%/%user%/conf/web/%domain%/nginx.forcessl.conf*;

        location ~ /\.(?!well-known\/|file) {
                deny all;
                return 404;
        }

        location / {
                proxy_pass http://127.0.0.1:5000;

                location ~* ^.+\.(css|htm|html|js|mjs|json|xml|apng|avif|bmp|cur|gif|ico|jfif|jpg|jpeg|pjp|pjpeg|png|svg|tif|tiff|webp|aac|caf|flac|m4a|midi|mp3|ogg|opus|wav|3gp|av1|avi|m4v|mkv|mov|mpg|mpeg|mp4|mp4v|webm|otf|ttf|woff|woff2|doc|docx|odf|odp|ods|odt|pdf|ppt|pptx|rtf|txt|xls|xlsx|7z|bz2|gz|rar|tar|tgz|zip|apk|appx|bin|dmg|exe|img|iso|jar|msi|webmanifest)$ {
                        try_files  $uri @fallback;

                        root       %docroot%;
                        access_log /var/log/nginx/domains/%domain%.log combined;
                        access_log /var/log/nginx/domains/%domain%.bytes bytes;

                        expires    max;
                }
        }

        location @fallback {
                proxy_pass http://127.0.0.1:5000;
        }

        location /error/ {
                alias %home%/%user%/web/%domain%/document_errors/;
        }

        include %home%/%user%/conf/web/%domain%/nginx.conf_*;
}

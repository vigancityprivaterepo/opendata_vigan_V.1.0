FROM nginx:1.25-alpine

# Remove the default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config (mounted via volume in compose, but baked in for prod)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose HTTP and HTTPS
EXPOSE 80 443

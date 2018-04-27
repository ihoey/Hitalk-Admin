config = {
    SITE_URL: process.env.SITE_URL || 'https://blog.ihoey.com',
    SITE_NAME: '梦魇小栈' || process.env.SITE_NAME,
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.qq.com',
    SMTP_USER: process.env.SMTP_USER || 'comment@ihoey.com',
    SMTP_PORT: process.env.SMTP_PORT || 465,
    SMTP_PASS: process.env.SMTP_PASS || 'zeuittjwgrwrbeaa',
    SENDER_EMAIL: process.env.SENDER_EMAIL || 'comment@ihoey.com',
    SENDER_NAME: '梦魇小栈👻' || process.env.SENDER_NAME
}

module.exports = config;

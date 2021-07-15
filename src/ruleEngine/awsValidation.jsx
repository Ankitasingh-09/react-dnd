const awsValidation = (start, end) => {
    switch (start) {
        case 'S3':
            if (end === 'users') return false;
            if (end === 'cloudfront') return true;
            return false;
        case 'Users':
            if (end === 's3') return true;
            if (end === 'cloudfront') return true
            return false;
        case 'Cloudfront':
            if (end === 'users') return false;
            if (end === 's3') return false;
            return false;
        default:
            return false;
    }
}
export default awsValidation;
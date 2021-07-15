import awsValidation from './awsValidation';

const validateConnection = (componentName, start, end) => {
    switch (componentName) {
        case 'awsComponent':
            return awsValidation(start,end);
        default:
}
    
}

export default validateConnection;

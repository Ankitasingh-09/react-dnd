const awsValidation = (startPoint, endPoint) => {
  const start = startPoint.split("_")[0];
  const end = endPoint.split("_")[0];
  switch (start) {
    case "S3":
      if (end === "users") return false;
      if (end === "cloudfront") return false;
      if (end === "dynamodb") return true;
      if (end === "lambda") return true;
      if (end === "elb") return false;
      if (end === "rds") return true;
      return false;
    case "Users":
      if (end === "s3") return true;
      if (end === "cloudfront") return true;
      if (end === "dynamodb") return true;
      if (end === "lambda") return true;
      if (end === "elb") return true;
      if (end === "aws") return true;
      if (end === "context") return true;
      if (end === "rds") return true;
      if (end === "ec2") return true;
      return false;
    case "Cloudfront":
      if (end === "users") return false;
      if (end === "s3") return true;
      if (end === "dynamodb") return true;
      if (end === "lambda") return true;
      if (end === "elb") return true;
      if (end === "rds") return true;
      return false;
    case "Context":
      if (end === "context") return true;
      return false;
    case "Lambda":
      if (end === "users") return false;
      if (end === "cloudfront") return false;
      if (end === "dynamodb") return true;
      if (end === "s3") return true;
      if (end === "elb") return true;
      if (end === "rds") return true;
      return false;
    case "Dynamodb":
      if (end === "users") return false;
      if (end === "cloudfront") return true;
      if (end === "ec2") return false;
      if (end === "s3") return true;
      if (end === "elb") return false;
      if (end === "rds") return false;
      return false;
    case "ELB":
      if (end === "users") return false;
      if (end === "cloudfront") return true;
      if (end === "ec2") return true;
      if (end === "s3") return true;
      if (end === "dynamodb") return true;
      if (end === "rds") return true;
      return false;
      case "RDS": 
     if (end === "users") return false;
     if (end === "cloudfront") return true;
     if (end === "ec2") return false;
     if (end === "s3") return true;
      if (end === "elb") return false;
      if (end === "dynamodb") return true;
      return false;
    default:
      return false;
  }
};
export default awsValidation;

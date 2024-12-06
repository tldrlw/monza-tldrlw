module "lambda_get_insights" {
  # source = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2?ref=dev"
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.insights.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-insights"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["insights"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_get_constructors" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.constructors.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.constructors.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-constructors"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["constructors"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_get_drivers" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.drivers.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.drivers.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-drivers"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["drivers"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_get_results" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.results.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.results.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-get"
  HTTP_METHOD                      = "GET"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-get-results"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["results"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

module "lambda_post_insight" {
  source           = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda-2"
  DYDB_PERMISSIONS = ["dynamodb:BatchWriteItem"]
  DYDB_TABLE_ARN   = aws_dynamodb_table.insights.arn
  ENV_VARS = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
  }
  HANDLER_FILE_PREFIX              = "app-post-insight"
  HTTP_METHOD                      = "POST"
  MEMORY_SIZE                      = 1028
  NAME                             = "${var.APP_NAME}-post-insight"
  PRIVATE_APIG_EXECUTION_ARN       = module.lambda_stack.private_apig_execution_arn
  PRIVATE_APIG_ID                  = module.lambda_stack.private_apig_id
  PRIVATE_APIG_RESOURCE_ID         = module.lambda_stack.private_apig_resource_ids["insights"]
  PRIVATE_APIG_SECURITY_GROUP_ID   = module.lambda_stack.private_apig_security_group_id
  PRIVATE_SUBNET_IDS               = module.lambda_stack.private_subnet_ids
  SOURCE_DIR                       = "lambda"
  VPC_ENDPOINT_DYDB_PREFIX_LIST_ID = module.lambda_stack.vpc_endpoint_dydb_prefix_list_id
  VPC_ID                           = var.BLOG_TLDRLW_VPC_ID
}

# must modify locals and aws_api_gateway_deployment depends_on when adding new apig-lambda-2 instantiations, and also (maybe) PRIVATE_APIG_RESOURCES in lambda_stack module

# lambda below not protected by private APIG, because image upload component in next.js running client-side, client-side code runs in browser, which does not have connectivity to the private APIG since it's not running server-side like other server-side GET API calls to lambdas (lambdas above), see 11/6/24 note in README for more on this
# can be secured in the future with IAM-APIG auth, code for it already built into module
module "lambda_post_image" {
  # source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda?ref=dev"
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post-image"
  REST_method         = "POST"
  # ^ not actually used in module.aws_lambda_function_url.self because of use_wildcard_method_in_function_url below
  function_name = "${var.APP_NAME}-post-image"
  environment_variables = {
    S3_BUCKET_NAME = aws_s3_bucket.images.id,
    REGION         = var.REGION
  }
  is_s3                               = true
  is_dydb                             = false
  s3_bucket_arn                       = aws_s3_bucket.images.arn
  s3_bucket_permissions               = ["s3:PutObject"]
  function_url_public                 = true
  use_wildcard_method_in_function_url = true
  # ^ required for lambda functions that upload images to S3
}
# AWS Lambda has a 6MB payload limit for synchronous invocations, but it’s generally best to keep image sizes under 5MB. Even slightly larger images, such as 5.3MB, may fail to upload due to factors like base64 encoding, which increases the payload size by about 33%, along with the inclusion of headers and metadata. These additional elements count toward the limit, potentially pushing the total payload over the 6MB threshold. To prevent issues, it’s recommended to compress or resize images before uploading. Alternatively, consider storing large files directly in S3 and passing the file URL to your Lambda function for processing.

# rm -rf .terraform/modules
# run ^ after pushing up changes to modules

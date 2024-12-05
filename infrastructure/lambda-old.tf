// currently being used by points calculator λs, will later be refactored to be in SG
module "lambda_get_constructors_old" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-constructors-old"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.constructors.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.constructors.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}

module "lambda_get_drivers_old" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-get"
  REST_method         = "GET"
  function_name       = "${var.APP_NAME}-get-drivers-old"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.drivers.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.drivers.arn
  dydb_table_permissions = ["dynamodb:Scan", "dynamodb:DescribeTable"]
  function_url_public    = true
}
//

module "lambda_post" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post"
  REST_method         = "POST"
  function_name       = "${var.APP_NAME}-post"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.insights.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.insights.arn
  dydb_table_permissions = ["dynamodb:BatchWriteItem"]
  function_url_public    = true
}

module "lambda_post_result" {
  source              = "git::https://github.com/tldrlw/terraform-modules.git//apig-lambda"
  source_dir          = var.LAMBDA_PATH
  handler_file_prefix = "app-post-result"
  REST_method         = "POST"
  function_name       = "${var.APP_NAME}-post-result"
  environment_variables = {
    DYDB_TABLE_NAME = aws_dynamodb_table.results.id,
    REGION          = var.REGION
  }
  is_s3                  = false
  is_dydb                = true
  dydb_table_arn         = aws_dynamodb_table.results.arn
  dydb_table_permissions = ["dynamodb:BatchWriteItem"]
  function_url_public    = true
}

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
# rm -rf .terraform/modules
# run ^ after pushing up changes to modules

# important note for lambda_post_image
# AWS Lambda has a 6MB payload limit for synchronous invocations, but it’s generally best to keep image sizes under 5MB. Even slightly larger images, such as 5.3MB, may fail to upload due to factors like base64 encoding, which increases the payload size by about 33%, along with the inclusion of headers and metadata. These additional elements count toward the limit, potentially pushing the total payload over the 6MB threshold. To prevent issues, it’s recommended to compress or resize images before uploading. Alternatively, consider storing large files directly in S3 and passing the file URL to your Lambda function for processing.

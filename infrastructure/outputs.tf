output "TF_VAR_APP_NAME" {
  value = var.APP_NAME
}

output "TF_VAR_IMAGE_TAG" {
  value = var.IMAGE_TAG
}

output "TF_VAR_ENV" {
  value = var.ENV
}

output "TF_VAR_HOSTNAME" {
  value = var.HOSTNAME
}

output "LAMBDA_POST_IMAGE" {
  value = module.lambda_post_image.function_url
}

# output "LAMBDA_POST_IMAGE_ARN" {
#   value = module.lambda_post_image.arn
# }

output "cognito_user_pool_id" {
  value = aws_cognito_user_pool.main.id
}

output "cognito_user_pool_endpoint" {
  value = aws_cognito_user_pool.main.endpoint
}

output "cognito_user_pool_client_secret" {
  value     = aws_cognito_user_pool_client.main.client_secret
  sensitive = true
}

output "cognito_user_pool_client_id" {
  value = aws_cognito_user_pool_client.main.id
}

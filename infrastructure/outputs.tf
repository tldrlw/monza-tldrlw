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

output "module_lambda_get_function_url" {
  value = module.lambda_get.function_url
}

output "module_lambda_get_arn" {
  value = module.lambda_get.arn
}

output "module_lambda_get_constructors_function_url" {
  value = module.lambda_get_constructors.function_url
}

output "module_lambda_get_constructors_arn" {
  value = module.lambda_get_constructors.arn
}

output "module_lambda_get_drivers_function_url" {
  value = module.lambda_get_drivers.function_url
}

output "module_lambda_get_drivers_arn" {
  value = module.lambda_get_drivers.arn
}

output "module_lambda_get_results_function_url" {
  value = module.lambda_get_results.function_url
}

output "module_lambda_get_results_arn" {
  value = module.lambda_get_results.arn
}

output "module_lambda_post_function_url" {
  value = module.lambda_post.function_url
}

output "module_lambda_post_arn" {
  value = module.lambda_post.arn
}

output "module_lambda_post_result_function_url" {
  value = module.lambda_post_result.function_url
}

output "module_lambda_post_result_arn" {
  value = module.lambda_post_result.arn
}

output "module_lambda_post_image_function_url" {
  value = module.lambda_post_image.function_url
}

output "module_lambda_post_image_arn" {
  value = module.lambda_post_image.arn
}

output "lambda_standings_compute_arn" {
  value = aws_lambda_function.standings_compute.arn
}

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

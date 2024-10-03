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

output "module_lambda_post_function_url" {
  value = module.lambda_post.function_url
}

output "module_lambda_post_arn" {
  value = module.lambda_post.arn
}

output "module_lambda_post_image_function_url" {
  value = module.lambda_post_image.function_url
}

output "module_lambda_post_image_arn" {
  value = module.lambda_post_image.arn
}

resource "aws_cognito_user_pool" "main" {
  name = "monza-tldrlw"
  password_policy {
    minimum_length    = 12
    require_numbers   = true
    require_uppercase = true
  }
}
# https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/cognito_user_pool

resource "aws_cognito_user_pool_client" "main" {
  name                                 = "monza-tldrlw"
  user_pool_id                         = aws_cognito_user_pool.main.id
  allowed_oauth_flows_user_pool_client = true
  generate_secret                      = false
  allowed_oauth_scopes                 = ["aws.cognito.signin.user.admin", "email", "openid", "profile"]
  allowed_oauth_flows                  = ["implicit", "code"]
  explicit_auth_flows                  = ["ADMIN_NO_SRP_AUTH", "USER_PASSWORD_AUTH"]
  # explicit_auth_flows                  = ["ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH", "USER_PASSWORD_AUTH"]
  # ^ might have to revisit this, check the tokens once a user is signed in...
  supported_identity_providers = ["COGNITO"]
  callback_urls                = ["https://${var.HOSTNAME}"]
  logout_urls                  = ["https://${var.HOSTNAME}"]
}

# resource "aws_cognito_user" "refayat" {
#   user_pool_id = aws_cognito_user_pool.main.id
#   username     = "refayat"
#   password     = ""
# }

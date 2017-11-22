require 'test_helper'
require 'jwt'

class UsersTest < ActionDispatch::IntegrationTest
  # test "the truth" do
  #   assert true
  # end
  test 'get  user' do
    token = JwtToken.createToken

    get '/users/me', params: {}, headers: { HTTP_AUTHORIZATION: token }

  end
end

class JwtToken
  class << self
    @@hmac_secret = 'my$ecretK3y'
    def createToken
      payload = {:email => 'john.doe@mycompany.com', :manager => 'manager@mycompany.com'}
      token = JWT.encode payload, @@hmac_secret, 'HS256'
      return token
    end
    def decodeToken(token)
      decoded_token = JWT.decode token, @@hmac_secret, true, { :algorithm => 'HS256' }
      return decoded_token
    end
  end
end
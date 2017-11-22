def token()
  payload = {:name => 'John Doe', :email => 'john.doe@mycompany.com'}
  token = JWT.encode payload, nil, 'none', { :typ => "JWT" }
end

def valid_headers
  {
    "Authorization" => "Bearer " + token(),
    "Content-Type" => "application/json"
  }
end

def invalid_headers
  {
    "Authorization" => nil,
    "Content-Type" => "application/json"
  }
end

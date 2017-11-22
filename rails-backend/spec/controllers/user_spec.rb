require "rails_helper"

describe "UserApiTests", type: :request do

  describe "GET #index" do
    it "resonds with success and status" do
      get "/users", headers: valid_headers
      json = JSON.parse(response.body)
      expect(response).to be_success
      expect(response).to have_http_status(200)
    end
  end

  describe "GET single user" do
    it "returns expected json" do
      user = FactoryGirl.create(:user)
      get "/users/#{user.id}", headers: valid_headers
      expect(response).to be_success
      expect(response).to have_http_status(200)
    end
  end

  describe "POST create user" do
    it "creates new user" do
      params = {name: 'John Doe', email: 'john.doe@mycompany.com'}
      post "/users", params: params.to_json, headers: valid_headers
      expect(response).to be_success
      expect(response).to have_http_status(201)
    end
  end

  describe "DELETE user" do
    it "deletes single user" do
      user = FactoryGirl.create(:user)
      delete "/users/#{user.id}", headers: valid_headers
      expect(response).to be_success
      expect(response).to have_http_status(204)
    end
  end

  describe "UPDATE user" do
    it "updates user" do
      user = FactoryGirl.create(:user)
      params = {name: 'John Doe', email: 'john.doe@mycompany.com'}
      put "/users/#{user.id}" , params: params.to_json, headers: valid_headers
      expect(response).to be_success
      expect(response).to have_http_status(200)
      parsed_body = JSON.parse(response.body)
      expect(parsed_body).to match(user.as_json)
    end
  end
end

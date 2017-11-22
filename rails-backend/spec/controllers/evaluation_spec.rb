require "rails_helper"

describe "EvaluationApiTests", type: :request do

  describe "GET #index" do
    it "responds with success and status" do
      get "/evaluations", headers: valid_headers
      json = JSON.parse(response.body)
      expect(response).to be_success
      expect(response).to have_http_status(200)
    end
  end

  describe "GET single evaluation" do
    context "when evaluation exists" do
      it "returns expected json" do
        evaluation = FactoryGirl.create(:evaluation)
        get "/evaluations/#{evaluation.id}", headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(200)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to match(evaluation.as_json)
      end
    end

    context "when evaluation doesnt exist" do
      let(:id){0}
      it "returns error response" do
        get "/evaluations/#{id}", headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Evaluation/)
      end
    end
  end

  describe "POST create evaluation" do
    let(:plan) {create(:plan)}
    context "valid evaluation attributes" do
      it "creates new evaluation" do
        params = { description: 'Description', rating: 10, plan_id: plan.id }
        post "/evaluations", params: params.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(201)
      end
    end

    context "invalid evaluation attributes" do
      it "returns error response" do
        params = { description: 'Description', rating: 10}
        post "/evaluations", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Plan/)
      end

      it "returns error response" do
        params = { description: 'Description', plan_id: plan.id}
        post "/evaluations", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/rating/)
      end

      it "returns error response" do
        params = {plan_id: plan.id}
        post "/evaluations", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/rating/)
      end
    end
  end

  describe "DELETE evaluation" do
    context "delete existing evaluation" do
      it "deletes single evaluation" do
        evaluation = FactoryGirl.create(:evaluation)
        delete "/evaluations/#{evaluation.id}", headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(204)
      end
    end

    context "delete nonexistant evaluation" do
      it "returns error response" do
        delete "/evaluations/1", headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Evaluation/)
      end
    end
  end

  describe "UPDATE evaluation" do
    let(:plan) {create(:plan)}
    context "update existing evaluation" do
      it "updates evaluation" do
        evaluation = FactoryGirl.create(:evaluation)
        evaluation_params = FactoryGirl.attributes_for(:evaluation)
        put "/evaluations/#{evaluation.id}" , params: {evaluation: evaluation_params}.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(200)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to match(evaluation.as_json)
      end
    end

    context "update nonexistant evaluation" do
      it "returns error response" do
        evaluation = FactoryGirl.create(:evaluation)
        evaluation_params = FactoryGirl.attributes_for(:evaluation)
        put "/evaluations/1" , params: {evaluation: evaluation_params}.to_json, headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Evaluation/)
      end
    end
  end
end

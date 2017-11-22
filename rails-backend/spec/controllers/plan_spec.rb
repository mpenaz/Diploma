require "rails_helper"

describe "PlanApiTests", type: :request do
  describe "GET #index" do
    it "responds with success and status" do
      get "/plans", headers: valid_headers
      json = JSON.parse(response.body)
      expect(response).to be_success
      expect(response).to have_http_status(200)
    end
  end

  describe "GET single plan" do
    context "when plan exists" do
      it "returns expected json" do
        plan = FactoryGirl.create(:plan)
        get "/plans/#{plan.id}", headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(200)
        parsed_body = JSON.parse(response.body)
      end
    end

    context "when plan doesnt exist" do
      let(:id){0}
      it "returns error response" do
        get "/plans/#{id}", headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Plan/)
      end
    end
  end

  describe "POST create plan" do
    let(:user) {create(:user)}
    let(:user1) {create(:user)}
    context "create multiple plans" do
      it "creates new plans" do
        plan = { startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: user.id }
        plan1 = { startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: user1.id }
        plans = [];
        plans << plan
        plans << plan1
        json = {plans: plans}
        post "/plans", params: json.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(201)
        expect(JSON.parse(response.body).size).to eq(2)
      end
    end

    context "create multiple  invalid plans" do
      it "returns error response" do
        plan = { startDate: '1.1.2009', endDate: '1.1.fadsfsad2010', status: 'created', user_id: user.id }
        plan1 = { startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: user1.id }
        plans = [];
        plans << plan
        plans << plan1
        json = {plans: plans}
        post "/plans", params: json.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/endDate/)
      end
    end

    context "valid plan attributes" do
      it "creates new plan" do
        params = { startDate: '1.1.2009', endDate: '1.1.2010', status: 'created', user_id: user.id }
        post "/plans", params: params.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(201)
      end
    end

    context "invalid plan attributes" do
      it "returns error response" do
        params = { startDate: '1.1.2009', endDate: '1.1.2010', status: 'created'}
        post "/plans", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/must exist/)
      end

      it "returns error response" do
        params = { startDate: '1.1.2009', user_id: user.id }
        post "/plans", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/can't be blank/)
      end

      it "returns error response" do
        params = { startDate: '1.1.gadsgdsa2009', endDate: '1.1.2010', status: 'created', user_id: user.id }
        post "/plans", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/can't be blank/)
      end
    end
  end

  describe "DELETE plan" do
    context "delete existing plan" do
      it "deletes single plan" do
        plan = FactoryGirl.create(:plan)
        delete "/plans/#{plan.id}", headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(204)
      end
    end

    context "delete nonexistant plan" do
      it "returns error response" do
        delete "/plans/1", headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Plan/)
      end
    end
  end

  describe "UPDATE plan" do
    let(:user) {create(:user)}
    context "update existing plan" do
      it "updates plan" do
        plan = FactoryGirl.create(:plan)
        plan_params = FactoryGirl.attributes_for(:plan)
        put "/plans/#{plan.id}" , params: {plan: plan_params}.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(200)
        parsed_body = JSON.parse(response.body)
      end
    end

    context "update nonexistant evaluation" do
      it "returns error response" do
        plan = FactoryGirl.create(:plan)
        plan_params = FactoryGirl.attributes_for(:plan)
        put "/plans/1" , params: {plan: plan_params}.to_json, headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Plan/)
      end
    end
  end
end

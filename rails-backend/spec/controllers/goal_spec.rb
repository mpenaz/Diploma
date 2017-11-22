require "rails_helper"

describe "GoalApiTests", type: :request do

  describe "GET #index" do
    it "resonds with success and status" do
      get "/goals", headers: valid_headers
      json = JSON.parse(response.body)
      expect(response).to be_success
      expect(response).to have_http_status(200)
    end
  end

  describe "GET single goal" do
    context "get existing goal" do
      it "returns expected json" do
        goal = FactoryGirl.create(:goal)
        get "/goals/#{goal.id}", headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(200)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to match(goal.as_json)
      end
    end

    context "get nonexistant goal" do
      it "returns error message" do
        get "/goals/1", headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Goal/)
      end
    end
  end

  describe "POST create goal" do
    let(:plan) {create(:plan)}

    context "create single goal" do
      it "creates new goal" do
        params = { complexity: 'Simple', title: 'text', description: 'Description', progress: 10, plan_id: plan.id, priority: 'High' }
        post "/goals", params: params.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(201)
      end

      it "returns error msg" do
        params = { complexity: 'Simple', description: 'Description', progress: 10, plan_id: plan.id, priority: 'High' }
        post "/goals", params: params.to_json, headers: valid_headers
        expect(response).to have_http_status(422)
        expect(response.body).to match(/can't be blank/)
      end
    end

    context "create multiple goals" do
      it "creates new list of goals" do
        goal = { complexity: 'Simple', title: 'text', description: 'Description', progress: 10, plan_id: plan.id, priority: 'High' }
        goal1 = { complexity: 'Simple', title: 'text', description: 'Description', progress: 10, plan_id: plan.id, priority: 'High' }
        goals = [goal, goal1]
        json = {goalList: goals}
        post "/goals", params: json.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(201)
        expect(JSON.parse(response.body).size).to eq(2)
      end

      it "returns error" do
        goal = { complexity: 'Simple', description: 'Description', progress: 10, plan_id: plan.id, priority: 'High' }
        goal1 = { complexity: 'Simple', title: 'text', description: 'Description', progress: 10, plan_id: plan.id, priority: 'High' }
        goals = [goal, goal1]
        json = {goalList: goals}
        expect { post "/goals", params: json.to_json, headers: valid_headers }.to change(Goal, :count).by(0)
      end
    end
  end

  describe "DELETE goal" do
    context "delete existing goal" do
      it "deletes single goal" do
        goal = FactoryGirl.create(:goal)
        delete "/goals/#{goal.id}", headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(204)
      end
    end

    context "delete nonexistant goal" do
      it "returns error message" do
        delete "/goals/1", headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Goal/)
      end
    end
  end

  describe "UPDATE goal" do
    context "update existing goal" do
      it "updates goal" do
        goal = FactoryGirl.create(:goal)
        goal_params = FactoryGirl.attributes_for(:goal)
        put "/goals/#{goal.id}" , params: {goal: goal_params}.to_json, headers: valid_headers
        expect(response).to be_success
        expect(response).to have_http_status(200)
        parsed_body = JSON.parse(response.body)
        expect(parsed_body).to match(goal.as_json)
      end
    end

    context "update nonexistant goal" do
      it "returns error msg" do
        goal_params = FactoryGirl.attributes_for(:goal)
        put "/goals/1" , params: {goal: goal_params}.to_json, headers: valid_headers
        expect(response).to have_http_status(404)
        expect(response.body).to match(/Couldn't find Goal/)
      end
    end
  end
end

class GoalsController < ApplicationController
  before_action :set_goal, only: [:show, :update, :destroy]

  # GET /goals
  def index
    @goals = Goal.all
    render json: @goals
  end

  # GET /goals/1
  def show
    render json: @goal
  end

  # POST /goals
  def create
    if params[:goalList]
      goals = []
      params[:goalList].each do |goal_json|
        if goal_json[:old_id]
          #if transgering shared goal we dont create new Goal, the shared goal is only moved to new plan
          #find goal
          goal_id = goal_json[:id]
          goal = Goal.find(goal_id)
          #find new plan
          plan_id = goal_json[:plan_id]
          plan = Plan.find(plan_id)
          #link goal to new plan
          plan.goals << goal
          #find old plan
          plan_id = goal_json[:old_id]
          plan = Plan.find(plan_id)
          #unlink from old plan
          plan.goals.delete(goal)
          #add shared goals fields
          json = goal.as_json
          json['shared_goals'] = goal.shared_goals
          goals << json
        else
          goal = Goal.create!(title: goal_json[:title], description: goal_json[:description],
                            complexity: goal_json[:complexity], priority: goal_json[:priority],
                            progress: goal_json[:progress], user_id: goal_json[:user_id])
          plan_id = goal_json[:plan_id]
          plan = Plan.find(plan_id)
          plan.goals << goal
          goals << goal
        end
      end
      render json: goals, status: :created
    else
      @goal = Goal.new(goal_params)
          if @goal.save
            if params[:plan_ids]
              #shared goal
              params[:plan_ids].each do |plan_id|
                plan = Plan.find(plan_id)
                plan.goals << @goal
              end
            else
              #simple goal
              plan_id = params[:plan_id]
              plan = Plan.find(plan_id)
              plan.goals << @goal
            end
            render json: @goal, status: :created, location: @goal
          else
            render json: @goal.errors, status: :unprocessable_entity
          end
    end
  end

  # PATCH/PUT /goals/1
  def update
      if @goal.update(goal_params)

        if params[:plan_ids]
          plan_ids = params[:plan_ids]
          @goal.plans.ids.each do |plan_id|
            if !plan_ids.include?(plan_id)
              plan = Plan.find(plan_id)
              plan.goals.delete(@goal)
            end
          end

          plan_ids.each do |plan_id|
            if !@goal.plans.ids.include?(plan_id)
              plan = Plan.find(plan_id)
              plan.goals << @goal
            end
          end
        end

        render json: @goal
      else
        render json: @goal.errors, status: :unprocessable_entity
      end
  end

  # DELETE /goals/1
  def destroy
    @goal.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_goal
    @goal = Goal.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def goal_params
    params.permit(:title, :description, :complexity, :priority, :progress, :user_id)
  end
end

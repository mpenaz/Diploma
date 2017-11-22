class PlansController < ApplicationController
  before_action :set_plan, only: [:show, :update, :destroy]

  # GET /plans
  def index
    @plans = Plan.all
    render json: @plans.to_json(include: :goals)
  end

  # GET /plans/1
  def show
    render json: @plan
  end

  # POST /plans
  def create
    if params[:plans]
      plans = []
      params[:plans].each do |plan_json|
        plan = Plan.create!(startDate: plan_json[:startDate], endDate: plan_json[:endDate],
                           status: plan_json[:status], user_id: plan_json[:user_id])
        plans << plan
      end
      render json: plans, status: :created
    else
      @plan = Plan.new(plan_params)
      @plan.save!
      render json: @plan, status: :created, location: @plan
    end
  end

  # PATCH/PUT /plans/1
  def update
    @plan.update!(plan_params)
    render json: @plan
  end

  # DELETE /plans/1
  def destroy
    @plan.destroy
    @plan.goals.each do |goal|
      if goal.complexity == 'Simple'
        goal.destroy
      end
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_plan
    @plan = Plan.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def plan_params
    params.permit(:startDate, :endDate, :status, :user_id, :evaluation_id)
  end
end

class EvaluationsController < ApplicationController
  before_action :set_evaluation, only: [:show, :update, :destroy]

  # GET /evaluations
  def index
    @evaluations = Evaluation.all
    render json: @evaluations
  end

  # GET /evaluations/1
  def show
    render json: @evaluation
  end

  # POST /evaluations
  def create
    @evaluation = Evaluation.new(evaluation_params)
    plan = Plan.find(params[:plan_id])
    @evaluation.save!
    plan.update_attribute(:evaluation_id, @evaluation.id)
    plan.update_attribute(:status, 'reviewed')
    render json: @evaluation, status: :created, location: @evaluation
  end

  # PATCH/PUT /evaluations/1
  def update
    @evaluation.update!(evaluation_params)
    render json: @evaluation
  end

  # DELETE /evaluations/1
  def destroy
    @evaluation.destroy
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_evaluation
    @evaluation = Evaluation.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def evaluation_params
    params.permit(:description, :rating)
  end
end

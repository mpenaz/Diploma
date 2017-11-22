class ApplicationController < ActionController::API
  NotAuthorized = Class.new(StandardError)
  before_action :retrieve_user_from_token
  attr_reader :current_user

  rescue_from ActiveRecord::RecordInvalid, with: :render_unprocessable_entity_response
  rescue_from ActiveRecord::RecordNotFound, with: :render_not_found_response
  rescue_from ApplicationController::NotAuthorized, with: :render_not_authorized

  def render_not_authorized
    render json: { error: 'Missing authorization header.' }, status: 401
  end

  def render_unprocessable_entity_response(exception)
    render json: exception.record.errors, status: :unprocessable_entity
  end

  def render_not_found_response(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def retrieve_token
    if !request.headers['HTTP_AUTHORIZATION'].present?
      raise ApplicationController::NotAuthorized
    end
    token = request.headers['HTTP_AUTHORIZATION']
    value = token.split(' ')
    return value[1]
  end

  def decode_token_unsigned(token)
    decoded_token = JWT.decode token, nil, false
    return decoded_token
  end

  def retrieve_user_from_token
    decoded_token = decode_token_unsigned(retrieve_token)
    payload = decoded_token[0]
    email = payload['email']
    @current_user = User.find_by_email(email)

    if !@current_user.present?
      #if unregistered user, register him and assign manager if he is already registered
      if payload['manager'].present?
        manager_email = payload['manager']
        manager = User.find_by_email(manager_email)
      end
      @current_user = User.create!(name: payload['name'], email: payload['email'])
      @current_user.manager = manager;
      @current_user.save
    end
    @current_user
  end
end

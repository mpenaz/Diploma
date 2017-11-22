Rails.application.routes.draw do
  get 'users/:id/subordinates', to: 'users#subordinates'  
  resources :plans
  resources :users
  resources :goals
  resources :evaluations
end

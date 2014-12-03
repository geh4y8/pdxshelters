Rails.application.routes.draw do

  mount Dashing::Engine, at: Dashing.config.engine_path
  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"}

  resources :guests
  root to: 'guests#index'

end

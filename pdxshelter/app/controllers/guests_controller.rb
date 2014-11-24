class GuestsController < ApplicationController

  before_filter :authenticate_user!, except: [:index, :show]

  def index

  end

end

class GuestsController < ApplicationController

  before_filter :authenticate_user!

  def index
    @guests = Guest.all
  end

  def new
    @guest = Guest.new
  end

  def create
    @guest = Guest.new(guest_params)
    if @guest.save
      flash[:notice] = "Guest created."
      redirect_to guests_path
    else
      render 'new'
    end
  end

  def show
    @guest = Guest.find(params[:id])
  end

  def edit
    @guest = Guest.find(params[:id])
  end

  def update
    @guest = Guest.find(params[:id])
    if @guest.update(guest_params)
      flash[:notice] = "Guest information updated"
      redirect_to guest_path(@guest)
    else
      render 'edit'
    end
  end

  def destroy
    @guest = Guest.find(params[:id])
    @guest.destroy
    flash[:notice] = "Guest deleted from system"
    redirect_to guests_path
  end

private

  def guest_params
    params.require(:guest).permit(:first_name, :last_name)
  end
end

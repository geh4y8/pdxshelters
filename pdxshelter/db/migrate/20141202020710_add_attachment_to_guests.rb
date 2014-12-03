class AddAttachmentToGuests < ActiveRecord::Migration
  def change
    add_attachment :guests, :avatar
  end
end

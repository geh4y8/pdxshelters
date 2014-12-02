class AddAttachmentToGuests2 < ActiveRecord::Migration
  def change
    remove_column :guests, :avatar_file_name
    remove_column :guests, :avatar_content_type
    remove_column :guests, :avatar_file_size
    remove_column :guests, :avatar_updated_at
    add_attachment :users, :tb_card
  end
end

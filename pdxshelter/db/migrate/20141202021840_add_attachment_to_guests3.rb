class AddAttachmentToGuests3 < ActiveRecord::Migration
  def change
    remove_column :users, :tb_card_file_name
    remove_column :users, :tb_card_content_type
    remove_column :users, :tb_card_file_size
    remove_column :users, :tb_card_updated_at
    add_attachment :guests, :tb_card
  end
end

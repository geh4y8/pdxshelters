class Guest < ActiveRecord::Base
  belongs_to :user

  has_attached_file :tb_card, :styles => { :medium => "300x300>", :thumb => "100x100>" }, :default_url => "/images/:style/missing.png"
  validates_attachment_content_type :tb_card, :content_type => /\Aimage\/.*\Z/
  
end

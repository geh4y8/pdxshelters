class Guest < ActiveRecord::Base
  belongs_to :user
end

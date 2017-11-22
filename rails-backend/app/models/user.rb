class User < ApplicationRecord
  has_many :plans
  has_many :goals
  has_many :subordinates, class_name: 'User', foreign_key: 'manager_id'
  belongs_to :manager, class_name: 'User', optional: true
end

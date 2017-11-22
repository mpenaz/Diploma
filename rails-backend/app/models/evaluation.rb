class Evaluation < ApplicationRecord
  has_one :plan
  validates :description, presence: true
  validates :rating, presence: true
end

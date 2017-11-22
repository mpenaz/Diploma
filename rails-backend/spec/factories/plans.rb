FactoryGirl.define do
  factory :plan do
    startDate "1.1.2009"
    endDate "1.1.2010"
    status "created"
    user
    evaluation
  end
end

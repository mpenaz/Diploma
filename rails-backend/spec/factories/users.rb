FactoryGirl.define do
  factory :user do
    name "John Doe"
    email "john.doe@mycompany.com"
    plans {[]}
  end
end

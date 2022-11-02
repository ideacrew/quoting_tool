FactoryBot.define do
  factory :county_zip, class: "Locations::CountyZip" do
    sequence :county_name do |n|
      "County #{n}"
    end

    sequence :zip do |n|
      11110 + n
    end
    state {"MA"}
  end
end

$rates = {}

Products::Product.all.each do |product|
  product.premium_tables.each do |pt|
    output = pt.premium_tuples.inject({}) do |result, tuple|
      result[tuple.age] = tuple.cost
      result
    end
    $rates[[product.id, pt.rating_area_id]] = {entries: output, max_age: product.premium_ages.max, min_age: product.premium_ages.min}
  end
end

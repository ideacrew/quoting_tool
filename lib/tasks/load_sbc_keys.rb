def parse_text(cell)
  cell.blank? ? nil : sanitize_value(cell)
end

def sanitize_value(value)
  value = value.to_s.split('.')[0] if value.is_a? Float
  value.gsub(/[[:cntrl:]]|^[\p{Space}]+|[\p{Space}]+$/, '')
end

puts ":: Started Creating SBC documents ::"

roster = Roo::Spreadsheet.open(ENV['sbc_path'])
sheet = roster.sheet(0)
columns = sheet.row(1)

output = (2..sheet.last_row).inject([]) do |result, id|
  row = Hash[[columns, sheet.row(id)].transpose]
  
  result << {
    hios_id: parse_text(row["hios_id"]),
    year: parse_text(row["year"]).to_i,
    identifier: parse_text(row["identifier"]),
    title: parse_text(row["title"])
  }

  result
end

output.each do |info|
  product = ::Products::Product.where(
    :"hios_id" => info[:hios_id],
    :"application_period.min".gte => Date.new(info[:year], 1, 1), :"application_period.max".lte => Date.new(info[:year], 1, 1).end_of_year
  ).first

  if product.blank?
    puts "No product for #{info[:hios_id]} #{info[:year]}"
    next
  end

  if product.sbc_document.blank?
    product.sbc_document = Documents::Document.new({title: info[:title], subject: "SBC", format: 'application/pdf', identifier: info[:identifier]})
    product.save
  end
end

puts ":: Created SBC documents ::"

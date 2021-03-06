require 'rubygems'
require 'json'
require 'nokogiri'

module Jekyll

  class Indexer < Generator

    def initialize(config = {})
      super(config)
      
      lunr_config = { 
        'excludes' => [],
        'strip_index_html' => false,
        'min_length' => 3,
        'stopwords' => 'stopwords.txt'
      }.merge!(config['lunr_search'])
      
      @excludes = lunr_config['excludes']
      
      # if web host supports index.html as default doc, then optionally exclude it from the url 
      @strip_index_html = lunr_config['strip_index_html']

      # stop word exclusion configuration
      @min_length = lunr_config['min_length']
      @stopwords_file = lunr_config['stopwords']
    end

    # Index all pages except pages matching any value in config['lunr_excludes'] or with date['exclude_from_search']
    # The main content from each page is extracted and saved to disk as json
    def generate(site)
      puts 'Running the search indexer...'

      # gather pages and posts
      items = pages_to_index(site)
      content_renderer = PageRenderer.new(site)
      index = []

      items.each do |item|
        entry = SearchEntry.create(item, content_renderer)

        puts entry.title

        entry.strip_index_suffix_from_url! if @strip_index_html
        entry.strip_stopwords!(stopwords, @min_length) if File.exists?(@stopwords_file) 

        content_start = entry.body.index('<!-- social end -->');
        content_end = entry.body.index('<!-- sidebar start -->');

        entry_text = entry.body[content_start..content_end]
        entry_text = Nokogiri.HTML(entry_text) { |config| config.noblanks }
        entry_text.search('script').remove()
        entry_text.search('link').remove()
        entry_text.search('style').remove()
        entry_text.xpath('//text()[1]').each{ |t|      t.content = t.content.lstrip }
        entry_text.xpath('//text()[last()]').each{ |t| t.content = t.content.rstrip }
        entry_text = entry_text.text.gsub("\r", " ").gsub("\n", " ").gsub("\t", " ")

        #puts entry_text

        index << {
          :title => entry.title,
          :url => entry.url,
          :desc => entry.desc,
          :date => entry.date,
          :categories => entry.categories,
          :body => entry_text
        }
        
        puts 'Indexed ' << "#{entry.title} (#{entry.url})"
      end
      
      json = JSON.generate({:entries => index})
      
      # Create destination directory if it doesn't exist yet. Otherwise, we cannot write our file there.
      Dir::mkdir(site.dest) unless File.directory?(site.dest)
      
      # File I/O: create search.json file and write out pretty-printed JSON
      filename = 'search-lunr.js'
      
      File.open(File.join(site.dest, filename), "w") do |file|
        file.write("var lunr_index = " + json + ";")
      end

      # Keep the search.json file from being cleaned by Jekyll
      site.static_files << Jekyll::SearchIndexFile.new(site, site.dest, "/", filename)
    end

  private
    
    # load the stopwords file
    def stopwords
      @stopwords ||= IO.readlines(@stopwords_file).map { |l| l.strip }
    end
    
    def pages_to_index(site)
      items = []
      
      # deep copy pages
      site.pages.each {|page| items << page.dup }
      site.posts.each {|post| items << post.dup }

      # only process files that will be converted to .html and only non excluded files 
      items.select! {|i| i.output_ext == '.html' && ! @excludes.any? {|s| (i.url =~ Regexp.new(s)) != nil } } 
      items.reject! {|i| i.data['exclude_from_search'] } 
      
      items
    end
  end
end
require 'nokogiri'

module Jekyll

  class PageRenderer
    def initialize(site)
      @site = site
    end
    
    # render the item, parse the output and get all text inside <p> elements
    def render(item)
      layout = item.data["layout"]
      item.data["layout"] = nil
      item.render({}, @site.site_payload)
      item.data["layout"] = layout

      text = item.output

      #doc = Nokogiri::HTML(item.output)
      #paragraphs = doc.search('p').map {|e| e.text }
      #paragraphs.join(" ").gsub("\r"," ").gsub("\n"," ")
      #doc.search('script').remove()
      #doc.search('link').remove()
      #doc.search('style').remove()
      #text = doc.text.gsub("\r", " ").gsub("\n", " ").gsub("\t", " ")
    end
  end
  
end
require 'nokogiri'

module Jekyll
  
  class SearchEntry
    def self.create(page_or_post, renderer)
      return create_from_post(page_or_post, renderer) if page_or_post.is_a?(Jekyll::Post)
      return create_from_page(page_or_post, renderer) if page_or_post.is_a?(Jekyll::Page)
      raise 'Not supported'
    end
    
    def self.create_from_page(page, renderer)
      title, desc, url = extract_title_and_url(page)
      body = renderer.render(page)
      date = nil
      categories = []

      SearchEntry.new(title, url, date, categories, desc, body)
    end
    
    def self.create_from_post(post, renderer)
      title, desc, url = extract_title_and_url(post)
      body = renderer.render(post)
      date = post.date
      categories = post.categories
      
      SearchEntry.new(title, url, date, categories, desc, body)
    end

    def self.extract_title_and_url(item)
      data = item.to_liquid
      [ data['social']['title'], data['social']['description'], data['url'] ]
    end

    attr_reader :title, :url, :date, :categories, :desc, :body
    
    def initialize(title, url, date, categories, desc, body)
      @title, @url, @date, @categories, @desc, @body = title, url, date, categories, desc, body
    end
    
    def strip_index_suffix_from_url!
      @url.gsub!(/index\.html$/, '')
    end
    
    # remove anything that is in the stop words list from the text to be indexed
    def strip_stopwords!(stopwords, min_length)
      @body = @body.split.delete_if() do |x| 
        t = x.downcase.gsub(/[^a-z]/, '')
        t.length < min_length || stopwords.include?(t)
      end.join(' ')
    end    
  end
end
module Jekyll
  
  class SearchIndexFile < StaticFile
    # Override write as the search.json index file has already been created 
    def write(dest)
      true
    end
  end
  
end

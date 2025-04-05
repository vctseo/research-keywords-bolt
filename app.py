import streamlit as st
import pandas as pd
from utils.google_ads import get_keyword_ideas, get_bulk_keyword_metrics

# Page config
st.set_page_config(
    page_title="Google Ads Keyword Research Tool",
    page_icon="🔍",
    layout="wide"
)

# Custom CSS
st.markdown("""
<style>
    .stApp {
        max-width: 1200px;
        margin: 0 auto;
    }
    .stButton>button {
        width: 100%;
    }
    .reportview-container .main .block-container {
        padding-top: 2rem;
    }
</style>
""", unsafe_allow_html=True)

# Title and description
st.title("🔍 Google Ads Keyword Research Tool")
st.markdown("""
This tool helps you research keywords using the Google Ads API. You can:
- Search for related keywords and their metrics
- Analyze multiple keywords at once
- Get search volume and competition data
""")

# Country and language selection with more options
countries = {
    "United States": "US",
    "United Kingdom": "GB",
    "Australia": "AU",
    "Canada": "CA",
    "Vietnam": "VN",
    "India": "IN",
    "Singapore": "SG",
    "Malaysia": "MY"
}

languages = {
    "English": "1000",
    "Vietnamese": "1005",
    "French": "1002",
    "German": "1001",
    "Spanish": "1003",
    "Chinese": "1004",
    "Japanese": "1006",
    "Korean": "1007"
}

col1, col2 = st.columns(2)
with col1:
    country = st.selectbox(
        "Select Country",
        options=list(countries.keys()),
        index=0
    )
    country_code = countries[country]

with col2:
    language = st.selectbox(
        "Select Language",
        options=list(languages.keys()),
        index=0
    )
    language_code = languages[language]

# Create tabs
tab1, tab2 = st.tabs(["Single Keyword Research", "Bulk Keyword Analysis"])

# Single Keyword Research Tab
with tab1:
    st.header("Single Keyword Research")
    with st.form("single_keyword_form"):
        keyword = st.text_input("Enter a keyword to research:")
        submit_button = st.form_submit_button("Research Keyword")
        
        if submit_button and keyword:
            with st.spinner("Fetching keyword data..."):
                results = get_keyword_ideas(keyword, country_code, language_code)
                
                if results:
                    df = pd.DataFrame(results)
                    st.success(f"Found {len(results)} related keywords!")
                    st.dataframe(
                        df,
                        column_config={
                            "keyword": "Keyword",
                            "avg_monthly_searches": st.column_config.NumberColumn(
                                "Monthly Searches",
                                help="Average monthly searches",
                                format="%d"
                            ),
                            "competition": st.column_config.TextColumn(
                                "Competition",
                                help="Competition level"
                            )
                        },
                        hide_index=True
                    )
                    
                    # Download button
                    csv = df.to_csv(index=False)
                    st.download_button(
                        "Download Results (CSV)",
                        csv,
                        f"keyword_research_{keyword}.csv",
                        "text/csv",
                        key='download-csv'
                    )
                else:
                    st.warning("No results found for this keyword.")

# Bulk Keyword Analysis Tab
with tab2:
    st.header("Bulk Keyword Analysis")
    with st.form("bulk_keywords_form"):
        keywords_text = st.text_area(
            "Enter keywords (one per line):",
            height=200,
            help="Enter multiple keywords, one per line"
        )
        
        analyze_button = st.form_submit_button("Analyze Keywords")
        
        if analyze_button and keywords_text:
            keywords_list = [k.strip() for k in keywords_text.split("\n") if k.strip()]
            
            if len(keywords_list) > 0:
                with st.spinner(f"Analyzing {len(keywords_list)} keywords..."):
                    results = get_bulk_keyword_metrics(keywords_list, country_code, language_code)
                    
                    if results:
                        df = pd.DataFrame(results)
                        st.success(f"Analysis complete! Found data for {len(results)} keywords.")
                        st.dataframe(
                            df,
                            column_config={
                                "keyword": "Keyword",
                                "avg_monthly_searches": st.column_config.NumberColumn(
                                    "Monthly Searches",
                                    help="Average monthly searches",
                                    format="%d"
                                ),
                                "competition": st.column_config.TextColumn(
                                    "Competition",
                                    help="Competition level"
                                )
                            },
                            hide_index=True
                        )
                        
                        # Download button
                        csv = df.to_csv(index=False)
                        st.download_button(
                            "Download Results (CSV)",
                            csv,
                            "bulk_keyword_research.csv",
                            "text/csv",
                            key='download-bulk-csv'
                        )
                    else:
                        st.warning("No results found for the provided keywords.")
            else:
                st.error("Please enter at least one keyword.")
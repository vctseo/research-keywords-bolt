from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
import os
from typing import List, Dict
import streamlit as st

def load_google_ads_client() -> GoogleAdsClient:
    """Initialize Google Ads API client."""
    try:
        credentials = {
            "developer_token": st.secrets["GOOGLE_ADS_DEVELOPER_TOKEN"],
            "client_id": st.secrets["GOOGLE_ADS_CLIENT_ID"],
            "client_secret": st.secrets["GOOGLE_ADS_CLIENT_SECRET"],
            "refresh_token": st.secrets["GOOGLE_ADS_REFRESH_TOKEN"],
            "login_customer_id": st.secrets["GOOGLE_ADS_LOGIN_CUSTOMER_ID"],
            "use_proto_plus": True,
        }
        return GoogleAdsClient.load_from_dict(credentials)
    except Exception as e:
        st.error(f"Failed to load Google Ads client: {str(e)}")
        return None

def get_keyword_ideas(keyword: str, country_code: str, language_code: str) -> List[Dict]:
    """Get keyword ideas from Google Ads API."""
    client = load_google_ads_client()
    if not client:
        return []
        
    keyword_plan_idea_service = client.get_service("KeywordPlanIdeaService")
    
    location_rns = [f"locations/{country_code}"]
    language_rn = f"languageConstants/{language_code}"
    
    try:
        request = client.get_type("GenerateKeywordIdeasRequest")
        request.language = language_rn
        request.geo_target_constants = location_rns
        request.include_adult_keywords = False
        request.keyword_plan_network = client.enums.KeywordPlanNetworkEnum.GOOGLE_SEARCH
        request.keyword_seed.keywords.append(keyword)

        response = keyword_plan_idea_service.generate_keyword_ideas(request=request)
        
        results = []
        for idea in response:
            results.append({
                "keyword": idea.text,
                "avg_monthly_searches": idea.keyword_idea_metrics.avg_monthly_searches,
                "competition": idea.keyword_idea_metrics.competition.name,
            })
        
        return results
    
    except GoogleAdsException as ex:
        st.error(f"Request failed with status {ex.error.code().name}")
        for error in ex.failure.errors:
            st.error(f'\tError with message "{error.message}".')
        return []
    except Exception as e:
        st.error(f"An unexpected error occurred: {str(e)}")
        return []

def get_bulk_keyword_metrics(keywords: List[str], country_code: str, language_code: str) -> List[Dict]:
    """Get metrics for multiple keywords."""
    results = []
    for keyword in keywords:
        if keyword.strip():
            keyword_data = get_keyword_ideas(keyword.strip(), country_code, language_code)
            if keyword_data:
                results.extend(keyword_data)
    return results
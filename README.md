# Google Ads Keyword Research Tool

A Streamlit web application for researching keywords using the Google Ads API. This tool helps you discover related keywords and their search metrics.

## Features

- Single keyword research with related keywords
- Bulk keyword analysis
- Country and language selection
- Monthly search volume data
- Competition metrics
- CSV export functionality
- Beautiful, user-friendly interface

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up your Google Ads API credentials in Streamlit Cloud:
   - Go to your Streamlit Cloud dashboard
   - Navigate to your app's settings
   - Add the following secrets:
     ```
     GOOGLE_ADS_CLIENT_ID=your-client-id
     GOOGLE_ADS_CLIENT_SECRET=your-client-secret
     GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
     GOOGLE_ADS_LOGIN_CUSTOMER_ID=your-customer-id
     GOOGLE_ADS_REFRESH_TOKEN=your-refresh-token
     ```

## Deployment

1. Push your code to GitHub
2. Connect your repository to Streamlit Cloud:
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Click "New app"
   - Select your repository
   - Choose the main branch and app.py file
   - Click "Deploy!"

## Usage

1. Select your target country and language
2. Choose between single keyword research or bulk analysis
3. Enter your keyword(s)
4. View results including:
   - Related keywords
   - Average monthly searches
   - Competition levels
5. Download results as CSV files

## Important Notes

- Make sure your Google Ads API credentials are properly set up in Streamlit Cloud secrets
- The tool respects Google Ads API quotas and rate limits
- Results may vary based on your Google Ads account access level
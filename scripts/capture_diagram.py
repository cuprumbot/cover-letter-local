import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        # open the html file
        file_path = f"file:///{os.path.abspath('docs/diagrams/architecture.html')}"
        await page.goto(file_path)
        # remove the toolbar before screenshot
        await page.evaluate("""
            const el = document.querySelector('.toolbar');
            if (el) el.style.display = 'none';
        """)
        # wait a bit for fonts to load
        await asyncio.sleep(1)
        # take screenshot of the specific container
        container = await page.query_selector('#report-container')
        await container.screenshot(path="docs/diagrams/architecture.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

from setuptools import setup, find_packages

setup(
    name="ckanext-vigan",
    version="1.0.0",
    description="Vigan City Open Data Portal — custom CKAN theme extension",
    long_description="Heritage-inspired emerald green theme for the "
                     "City Government of Vigan, Ilocos Sur, Philippines.",
    author="City Government of Vigan — ICT Office",
    author_email="ict@vigan.gov.ph",
    url="https://github.com/vigan-city/ckanext-vigan",
    license="MIT",
    packages=find_packages(exclude=["ez_setup", "tests", "tests.*"]),
    include_package_data=True,
    zip_safe=False,
    install_requires=[
        "ckan>=2.10.0",
    ],
    entry_points={
        "ckan.plugins": [
            "vigan = ckanext.vigan.plugin:ViganPlugin",
        ],
        "babel.extractors": [
            "ckan = ckan.lib.extract:extract_ckan",
        ],
    },
    message_extractors={
        "ckanext": [
            ("**.py", "python", None),
            ("**.js", "javascript", None),
            ("**/templates/**.html", "ckan", None),
        ],
    },
)

from django.shortcuts import render
from django.views.generic import TemplateView


class homepage(TemplateView):
    template_name = "main_app/homepage.html"

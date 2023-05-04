from django.db.models.signals import post_save
from django.dispatch import receiver
from django_elasticsearch_dsl.registries import registry


@receiver(post_save)
def update_document(sender, **kwargs):
    """update document on add/changed record"""
    
    app_label = sender._meta.app_label
    model_name = sender._meta.model_name
    
    instance = kwargs['instance']
    
    if app_label == "djapps.posts":
        
        if model_name == "videocontent":
            pass
        elif model_name == "channel":
            pass
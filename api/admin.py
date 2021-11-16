from django.contrib import admin
from api.models import Profile, AssetBundle, Asset, Category, Item, Comment, Like, Follower

# Register your models here.


class ItemAdmin(admin.ModelAdmin):

    list_display = ['owner', 'asset_bundle', 'get_category', 'created_at']

admin.site.register(Item, ItemAdmin)


class ProfileAdmin(admin.ModelAdmin):

    list_display = ['user']

admin.site.register(Profile, ProfileAdmin)


class AssetBundleAdmin(admin.ModelAdmin):

    def preview(self, obj):
        html = '<ul>'
        for key, url in obj.asset_urls.iteritems():
            #print (key)
            html += '<li><a href="%s" target="_blank"><img src="%s" width="128" /></a></li>' % (url, url)

        html += '</ul>'
        return html
    preview.allow_tags = True

    list_display = ['salt', 'kind']
    readonly_fields = ('preview',)


admin.site.register(AssetBundle, AssetBundleAdmin)


class AssetAdmin(admin.ModelAdmin):

    def preview(self, obj):
        return '<img src="%s" width="100" />' % obj.full_url

    preview.allow_tags = True

    list_display = ['preview', 'kind', 'extension', 'full_url']


admin.site.register(Asset, AssetAdmin)


class CategoryAdmin(admin.ModelAdmin):

    list_display = ['title', 'slug', 'created_at', 'updated_at']

admin.site.register(Category, CategoryAdmin)


class CommentAdmin(admin.ModelAdmin):
    pass


admin.site.register(Comment, CommentAdmin)


class LikeAdmin(admin.ModelAdmin):
    pass


admin.site.register(Like, LikeAdmin)


class FollowerAdmin(admin.ModelAdmin):
    pass


admin.site.register(Follower, FollowerAdmin)

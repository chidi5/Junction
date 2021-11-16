from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify
#from base.utils import unique_slug_generator
from django.conf import settings

from django.db.models.signals import pre_save


class Profile(models.Model):
    """
    This is the user profile model
    """

    ROLE_CHOICES = (
        ('consumer','Consumer'),
        ('staff','Staff'),
    )

    user = models.OneToOneField(User)
    image = models.ImageField(upload_to='images', null=True, blank=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(blank=True, null=True, max_length=100)
    portfolio_url = models.CharField(blank=True, null=True, max_length=100) 
    website_url = models.CharField(blank=True, null=True, max_length=100)
    password = models.CharField(blank=True, null=True, max_length=100)
    role = models.CharField(max_length=8, choices=ROLE_CHOICES)

    def __str__(self):
        return self.user.username

    '''def save(self, *args, **kwargs):
        if not self.image:
            self.image = f'profile.gif'
        super(Profile, self).save(*args, **kwargs)'''


class AssetBundle(models.Model):
    """
    This is the Asset Bundle profile model

    {base_url}{ab_kind}/{ab_salt}_{a_kind}.{a_extension}
    """

    KIND_CHOICES = (
        ('image', 'Image'),
        ('video', 'Video'),
    )

    salt = models.CharField(max_length=16)
    kind = models.CharField(max_length=5, choices=KIND_CHOICES, default="image")
    base_url = models.CharField(max_length=255, default=settings.S3_BASE_URL)

    owner = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return "AssetBundle: %s" % self.salt

    @property
    def asset_urls(self):
        array = {}
        for asset in Asset.objects.filter(asset_bundle=self):
            array[asset.kind] = asset.full_url
        return array


class Asset(models.Model):
    """
    This is Asset model
    """

    KIND_CHOICES = (
        ('original', 'Original'),
        ('large', 'Large'),
        ('small', 'Small'),
    )

    EXTENSION_CHOICES = (
        ('png','png'),
        ('gif','gif'),
        ('jpg','jpg'),
        ('jpeg','jpeg'),
        ('mp4','mp4'),
    )

    asset_bundle = models.ForeignKey(AssetBundle)
    kind = models.CharField(max_length=8, choices=KIND_CHOICES, default="original")
    width = models.IntegerField(default=0)
    height = models.IntegerField(default=0)
    extension = models.CharField(max_length=4, choices=EXTENSION_CHOICES)
    processing = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return "Asset: %s: %s" % (self.asset_bundle.salt, self.kind)

    @property
    def full_url(self):
        return "%s%s/%s_%s.%s" % (self.asset_bundle.base_url, self.asset_bundle.kind, self.asset_bundle.salt, self.kind, self.extension)


class Category(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Created at")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Updated at")
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"
        ordering = ['title']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.id:
            self.slug = slugify(self.title)
        super(Category, self).save(*args, **kwargs)

'''def slug_save(sender, instance, *args, **kwargs):
    if not instance.slug:
        instance.slug = unique_slug_generator(instance, instance.title, instance.slug)

pre_save.connect(slug_save, sender=Category)'''


class Item(models.Model):
    """
    This is the model for items.
    """

    asset_bundle = models.ForeignKey(AssetBundle)
    category = models.ManyToManyField(Category, blank=True)

    owner = models.ForeignKey(User)
    title = models.CharField(max_length=128, null=True, blank=True)
    body = models.CharField(max_length=400, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return "Item: %s: %s" % (self.owner.username, self.asset_bundle.salt)

    def __unicode__(self):
        return "Item: %s: %s" % (self.owner.username, self.asset_bundle.salt)

    def get_category(self):
        return ",\n".join([c.slug for c in self.category.all()])

    @property
    def total_likes(self):
        return Like.objects.filter(item_id=self.id).count()

    @property
    def likes(self):
        array = []
        for like in Like.objects.filter(item_id=self.id):
            array.append(like.owner.username)
        return array

    @property
    def total_comments(self):
        return Comment.objects.filter(item_id=self.id).count()

    @property
    def comments(self):
        array = []
        for comment in Comment.objects.filter(item_id=self.id):
            c = {}
            c['body'] = comment.body
            c['username'] = comment.owner.username
            c['created_at'] = comment.created_at
            array.append(c)
        return array



class Comment(models.Model):

    item = models.ForeignKey(Item)
    body = models.TextField()

    owner = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Like(models.Model):

    item = models.ForeignKey(Item)

    owner = models.ForeignKey(User)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('item', 'owner',)


class Follower(models.Model):
    follower = models.ForeignKey(User, related_name='following')
    following = models.ForeignKey(User, related_name='followers')
    created = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('follower', 'following',)

    def __str__(self):
        return u'%s follows %s' % (self.follower, self.following)

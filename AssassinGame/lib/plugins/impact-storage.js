/**
 *  @impact-storage.js
 *  @version: 1.01
 *  @author: Jordan Santell
 *  @date: October 2011
 *  @copyright (c) 2011 Jordan Santell, under The MIT License (see LICENSE)
 *
 *  ImpactStorage is a plugin for HTML5/js game framework ImpactJS, giving
 *  developers an easy-to-use interface to localStorage for their projects.
 */

ig.module(
    'plugins.impact-storage'
)
.requires(
    'impact.game'
)
.defines(function(){

ig.Storage = ig.Class.extend({

    staticInstantiate: function(i)  {
        return !ig.Storage.instance ? null : ig.Storage.instance;
    },

    init: function()    {
        ig.Storage.instance = this;
    },

    //返回true如果浏览器能够使用localStorage。否则为false。
    isCapable: function()   {
        return !(typeof(window.localStorage) === 'undefined');
    },

    //返回true如果已在localStorage关键。否则为false。
    isSet: function(key)   {
        return !(this.get(key) === null);
    },

    //如果key没有被设置设置键值对
    initUnset: function(key, value) {
        if (this.get(key) === null) this.set(key, value);
    },

    //返回指定关键字的值，或者可也解析的JSON对象
    get: function(key)  {
        if (!this.isCapable()) return null;
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch(e)  {
            return window.localStorage.getItem(key);
        }
    },

    getInt: function(key)   {
        return ~~this.get(key);
    },

    getFloat: function(key) {
        return parseFloat(this.get(key));
    },

    getBool: function(key)  {
        return !!this.get(key);
    },

    //放回指定位置key的值
    key: function(n)    {
        return this.isCapable() ? window.localStorage.key(n) : null;
    },

    //设置键值对
    set: function(key, value)    {
        if (!this.isCapable()) return null;
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch(e)  {
            if(e == QUOTA_EXCEEDED_ERR)
                console.log('localStorage quota exceeded');
        }
    },


    //保存在指定位置上的更大的数据
    setHighest: function(key, value)    {
        if(value > this.getFloat(key)) this.set(key, value);
    },

    //删除指定key的值
    remove: function(key)   {
        if (!this.isCapable()) return null;
        window.localStorage.removeItem(key);
    },


    //清空数据
    clear: function()   {
        if (!this.isCapable()) return null;
        window.localStorage.clear();
    }
});

});
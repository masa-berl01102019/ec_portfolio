{{ $admin_name }} 様

パスワード再設定について

パスワード再設定のリクエストを承りましたことをお知らせいたします。


以下のリンクをクリックしてパスワードを変更出来ます。

【パスワード再設定リンク】
　{{'http://homestead.test/admin/change_password/'.$password_reset->uuid}}

【パスワード再設定の有効期限】
　{{ $password_reset->expired_at->format('Y年m月d日 H時i分') }}

もしあなたがパスワード再設定をリクエストしていない場合は、このメールを無視して下さい。
上記リンクをクリックして新しいパスワードを作成しない限り、パスワードは変更されません。
上記のリンクには有効期限がございます。
有効期限を過ぎた場合は上記のリンクにアクセス出来なくなります。
予めご了承のほど、何卒宜しくお願い申し上げます。
   /// toggal click for page fadein and hide on the click trigger//

   $(document).on('click', '.pagex', function() {
       const page = $(this).attr('page');
       if (page.length) {
           pages(page)
       }
   })

   // fetch("https://www.buybani.com/wp-json/wc/store/products").then(o => o.json()).then((o) => {
   //     console.log(o)
   // })
   $(document).on('click', '.pagex[page="cart"]', function() {
           async function run2() {
               try {
                   const loader = $('.loader');
                   const totals = $('.totals-checkout');
                   const home_more = $('.load-cart');
                   home_more.empty()
                   for (var i = 1; i <= 10; i++) {
                       home_more.append(product_big(null, true))
                   }
                   totals.hide()

                   const datax = await cartiteams();


                   if (datax.total === undefined) {
                       home_more.empty()
                   } else {
                       totals.fadeIn()
                       home_more.empty()
                       console.log(datax)
                           //  datax.data.forEach(e => {});
                       $.each(datax.data, function(o, e) {
                           var qq;
                           if (e.quantity.max_purchase === e.quantity.min_purchase) {
                               qq = false
                           } else {
                               qq = true
                           }
                           const send = {
                               cover: e.featured_image,
                               item_key: e.item_key,
                               title: e.name,
                               regular_price: e.price_regular,
                               price: e.price,
                               qq
                           }
                           console.log(send)
                           home_more.append(product_big(send))
                       })
                   }
               } catch (error) {
                   console.log(error)
               }
           }
           run2()
       })
       ///on remove click 
   $(document).on('click', '.addtocart.Remove.big', function() {
       const key = $(this).attr('id');
       async function run2() {
           try {
               console.log(true)
               const loader = $('.loader');
               const totalsx = $('.totals-checkout');
               loader.show()
               const cart_key = get('cart_key');
               const data = await cocart('/cart/item/' + key + '?cart_key=' + cart_key, 'DELETE')
               await totals()
               console.log(data)
               if (data.items[0]) {} else {
                   totalsx.hide();
               }
               $('.big[id="' + key + '"]').remove()
               loader.hide()
               await count()
           } catch (error) {
               console.log(error)
           }
       }
       run2()
   })

   function pages(page) {
       if (page) {
           $('.true').removeClass('true').hide();
           $('[id="' + page + '"]').addClass('true').fadeIn();
       }
       $('.page').each(function(o, v) {
           const check = $(this).hasClass('true');
           if (check) {
               $(this).fadeIn()
           } else {
               $(this).hide()
           }
       })
   }
   pages()

   function product_big(data, fake) {
       //for: flex-down
       if (fake === true) {
           return `<div class="product big fake">
    <div class="cover-big">
        <div class="cover big fake"></div>
    </div>
    <div class="product-data big">
        <div class="big product-title"></div>
        <div class="price big mini">
            <div class="fake-after"></div>
            <div class="fake-before"></div>
        </div>
        <div class="addtocart big"></div>
    </div>
</div>`
       } else {
           var view;
           var id;
           var view2;
           if (data.item_key) {
               var qq;
               if (data.qq === true) {
                   qq = `<form action="" method="post" class="for-product-addtional">
                 <span id="${data.item_key}" class="material-icons remove-qq">remove</span>
                    <input id="${data.item_key}" type="number" value="1" name="" id="">
                 <span id="${data.item_key}" class="material-icons add-qq">add</span>
                </form>`;
               } else {
                   qq = '';
               }
               view = `
                <div  id="${data.item_key}" class="product-addtional-data big">
                    <div id="${data.item_key}" class="addtocart Remove big">Remove</div>
                    ${qq}
                </div>`;
               view2 = ''
               id = `id="${data.item_key}"`;
           } else {
               view = '';
               view2 = `<div class="addtocart View big">View</div>`;
               id = '';
           }
           var price;
           if (data.price === data.regular_price) {
               price = `<div class="after">${data.price}</div>`
           } else {
               price = `<div class="after">${data.price}</div>
        <div class="before">${data.regular_price}</div>`
           }
           return `<div ${id} class="product big">
    <div class="cover-big">
        <div style="background-image: url(${data.cover});" class="cover big"></div>
    </div>
    <div class="product-data big">
        <div class="big product-title">${data.title}</div>
        <div class="price big mini">${price}</div>
        ${view2}
    </div>
</div> ${view}`
       }
   }

   function categories(data, fake) {
       //for: categories.mini
       if (fake === true) {
           return `<div class="categorie mini fake"></div>`
       } else {
           return `<div id="${data.id}" class="categorie mini">
        <div class="categorie-name">${data.title}</div>
        <div class="categorie-count">${data.count}</div>
        </div>`
       }
   }

   function product(data, fake) {
       //for: scroll-grid
       if (fake === true) {
           return `
<div class="product fake mini">
    <div class="cover"></div>
    <div class="price mini">
        <div class="fake-after"></div>
        <div class="fake-before"></div>
    </div>
    <div class="addtocart mini"></div>
</div>`
       } else {
           var price;
           var csstitle;
           if (data.price === data.regular_price) {
               price = `<div class="after">${data.price}</div>`
               csstitle = `style="-webkit-line-clamp: 2;"`;
           } else {
               price = `<div class="after">${data.price}</div>
        <div class="before">${data.regular_price}</div>`
               csstitle = '';
           }
           return `<div class="product mini">
    <div style="background-image: url(${data.cover});" class="cover">
    </div>
    <div ${csstitle} class="product-title mini">${data.title}</div>
    <div class="price mini">${price}</div>
    <div onclick="addtocart(${data.id},1)" class="addtocart mini">Add to cart</div>
</div>`
       }
   }
   /////////////////////////////
   /////////////////////////////
   /////////////////////////////
   ///??????????APIS?????????///
   /////////////////////////////
   /////////////////////////////
   /////////////////////////////
   async function cocart(link, type) {
       try {
           if (type) {
               return fetch('https://www.buybani.com/wp-json/cocart/v2' + link, {
                   method: type
               }).then(o => o.json())
           } else {
               return fetch('https://www.buybani.com/wp-json/cocart/v2' + link).then(o => o.json())
           }
       } catch (error) {
           return error
       }
   }
   async function wc(link, type, body) {
       try {
           if (type) {
               var bodyxx
               if (body) {
                   bodyxx = body
               } else {
                   bodyxx = '';
               }
               return fetch('https://www.buybani.com/wp-json/wc/v3' + link, {
                   method: type,
                   body: bodyxx,
               }).then(o => o.json())
           } else {
               return fetch('https://www.buybani.com/wp-json/wc/v3' + link).then(o => o.json())
           }
       } catch (error) {
           return error
       }
   }
   /////////////////////////////
   /////////////////////////////
   /////////////////////////////
   ///??????????APIS?????????///
   /////////////////////////////
   /////////////////////////////
   /////////////////////////////

   wc('/orders', "POST", `${queryx({
            billing_first_name: "syera",
            billing_last_name: "chan",
            billing_country: "PK",
            billing_address_1: "rawalpindi",
            billing_state: "PB",
            billing_phone: "03009851933",
            billing_email: "syeramusic@gmail.com",
            shipping_first_name: "",
            shipping_last_name: "",
            shipping_country: "PK",
            shipping_address_1: "",
            shipping_city: "",
            shipping_state: "",
            shipping_postcode: "",
            order_comments: "",
            flat_rate: "1",
            payment_method: "bykea_cash",
        })}`).then((o) => {
       console.log(o)
   })
   console.log()
   async function count() {
       try {
           var data;
           const key = get('cart_key');
           if (get('cart_key')) {
               data = await cocart(`/cart/items/count?cart_key=${key}`);
           } else {
               data = await cocart(`/cart/items/count`);
           }
           $('html').css('--count', `"${data}"`)
       } catch (error) {
           console.log(error)
       }
   }
   async function totals() {
       try {
           const key = get('cart_key');
           if (key) {
               const totals = await cocart(`/cart/totals?cart_key=${key}`);
               $('.totals').text(`Rs${totals.total}`)
               return totals.total;
           } else {
               return 0
           }
       } catch (error) {
           console.log(error)
       }
   }
   async function cartiteams() {
       try {
           const key = get('cart_key');
           if (key) {
               const data = await cocart(`/cart/items?cart_key=${key}`);
               const total = await totals();
               return {
                   data,
                   total
               }
           } else {
               return null
           }
       } catch (error) {
           console.log(error)
       }
   }
   async function addtocart(id, quantity) {
       try {
           var data;
           const loader = $('.loader');
           loader.show()
           const key = get('cart_key');
           if (get('cart_key')) {
               data = await cocart(`/cart/add-item?id=${id}&quantity=${quantity}&cart_key=${key}`, "POST");
           } else {
               data = await cocart(`/cart/add-item?id=${id}&quantity=${quantity}`, "POST");
               seti('cart_key', data.cart_key)
           }
           await count()
           console.log(data)
           loader.hide()
       } catch (error) {
           console.log(error)
       }
   }
   async function run() {
       try {
           const pe = $('.products.scroll-grid.home');
           const home_more = $('.home-more');
           const categories_home = $('.categories.mini');
           for (var i = 1; i <= 10; i++) {
               pe.append(product(null, true))
               categories_home.append(categories(null, true))
               home_more.append(product_big(null, true))
           }
           await count()
           const categories_data = await cocart('/products/categories?orderby=count&order=asc&hide_empty=true')
           categories_home.empty();

           categories_data.forEach(e => {
               const send = {
                   id: e.id,
                   count: e.count,
                   title: e.name
               }
               console.log(e)
               categories_home.prepend(categories(send))
           });
           const data = await cocart('/products?page=1')
           pe.empty()
           data.forEach(e => {
               const send = {
                   id: e.id,
                   price: e.prices.price,
                   regular_price: e.prices.regular_price,
                   cover: e.images[0].src.thumbnail,
                   title: e.name
               }

               pe.prepend(product(send))
           });
       } catch (error) {
           console.log(error)
       }
   }
   run()
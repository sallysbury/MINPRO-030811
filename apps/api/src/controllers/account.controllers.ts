import { transporter } from '@/helpers/nodemailer';
import prisma from '@/prisma';
import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs'
import { compare, genSalt, hash } from 'bcrypt';
import Handlebars from 'handlebars';

export class AccountController {
  async getAccount(req: Request, res: Response) {
    try {
      if (req.user?.type == 'users') {
        const user = await prisma.user.findUnique({
          where: {
            id: req.user.id,
          },
          include: {
            Point: true,
          },
        });
        const getPoint = await prisma.point.findFirst({
          where: {
            userId: user?.id,
            redeem: false,
          },
        });
        if (getPoint !== null) {
          const userPoint = await prisma.point.aggregate({
            where: {
              userId: user?.id,
              redeem: false,
            },
            _sum: {
              point: true,
            },
            _min: {
              expiredDate: true,
            },
          });
          const expireSoonPoint = await prisma.point.aggregate({
            where: {
              userId: user?.id,
              redeem: false,
            },
            _sum: {
              point: true,
            },
          });
          return res.status(200).send({
            status: 'ok',
            message: 'found',
            data: {
              id: user?.id,
              name: user?.name,
              email: user?.email,
              referral: user?.referral,
              type: user?.type,
              sumPoint: userPoint._sum.point,
              expireSoonPoint: expireSoonPoint._sum.point,
              expireDate: userPoint._min.expiredDate,
              image: user?.image,
            },
          });
        }
        res.status(200).send({
          status: 'ok',
          message: 'account found',
          data: {
            id: user?.id,
            name: user?.name,
            email: user?.email,
            type: user?.type,
            referral: user?.referral,
            sumPoint: 0,
            image: user?.image,
          },
        });
      }
      if (req.user?.type == 'promotors') {
        const promotor = await prisma.promotor.findUnique({
          where: {
            id: req.user?.id,
          },
        });
        res.status(200).send({
          status: 'ok',
          message: 'promotors found',
          data: {
            id: promotor?.id,
            name: promotor?.name,
            email: promotor?.email,
            type: promotor?.type,
            image: promotor?.image,
          },
        });
      }
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }
  async getAccountType(req: Request, res: Response) {
    try {
      const type = req.user?.type;
      res.status(200).send({
        status: 'ok',
        message: 'type found',
        type,
      });
    } catch (error) {
      res.status(400).send({
        status: 'error',
        error,
      });
    }
  }
  async verify(req: Request, res: Response) {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    const expired = date.setMonth(date.getMonth() + 3);
    try {
      let user;
      if (req.user?.type == 'users') {
        if (req.user.userId !== undefined) {
          user = await prisma.user.update({
            data: {
              isActive: true,
              redeem: false,
              redeemExpire: new Date(expired),
            },
            where: {
              id: req.user.id,
            },
          });

          await prisma.point.create({
            data: {
              userId: req.user.userId,
              expiredDate: new Date(expired),
            },
          });

          const point = await prisma.point.aggregate({
            where: {
              userId: req.user.id,
              redeem: false,
            },
            _sum: {
              point: true,
            },
            _min: {
              expiredDate: true,
            },
          });
          const expireSoonPoint = await prisma.point.aggregate({
            where: {
              expiredDate: new Date(point._min.expiredDate!),
              redeem: false,
            },
            _sum: {
              point: true,
            },
          });

          const payload = { id: user.id, type: user.type };
          const token = sign(payload, process.env.KEY_JWT!, {
            expiresIn: '1h',
          });

          return res.status(200).send({
            status: 'ok',
            message: 'user found',
            token,
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              referral: user.referral,
              type: user.type,
              sumPoint: point._sum.point,
              expireSoonPoint: expireSoonPoint._sum.point,
              expireDate: point._min.expiredDate,
              image: user.image,
              point,
            },
          });
        } else {
          const user = await prisma.user.update({
            data: {
              isActive: true,
            },
            where: {
              id: req.user?.id,
            },
          });
          const payload = { id: user.id, type: user.type };
          const token = sign(payload, process.env.KEY_JWT!, {
            expiresIn: '1d',
          });
          res.status(200).send({
            status: 'ok',
            message: 'user has no point',
            data: {
              id: user.id,
              name: user.name,
              email: user.email,
              referral: user.referral,
              sum: 0,
              type: user.type,
            },
            token,
          });
        }
      }
      if (req.user?.type == 'promotors') {
        const promotor = await prisma.user.update({
          data: {
            isActive: true,
          },
          where: {
            id: req.user.id,
          },
        });
        const payload = { id: promotor.id, type: promotor.type };
        const token = sign(payload, process.env.KEY_JWT!, {
          expiresIn: '1d',
        });
        res.status(200).send({
          status: 'ok',
          meesage: 'promotor verified',
          token,
          data: {
            id: promotor.id,
            name: promotor.name,
            email: promotor.email,
            type: promotor.type,
            image: promotor.image,
          },
        });
      }
    } catch (error) {
      res.status(200).send({
        status: 'error',
        error,
      });
    }
  }
  async imageUpload(req: Request, res: Response) {
    try {
        const {file} = req
        if (!file) throw "No file uploaded"
        const imageUrl = `http://localhost:8000/public/images/${file.filename}`
        if (req.user?.type == "users") {
            await prisma.user.update({
                data: {
                    image: imageUrl
                }, where: {
                    id: req.user?.id
                }
            })
        }
        if (req.user?.type == "Promotors") {
            await prisma.promotor.update({
                data: {
                    image: imageUrl
                }, where: {
                    id: req.user?.id
                }
            })
        }
        res.status(200).send({ 
            status: 'ok',
            message: 'image successfully uploaded'
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
    }
}
  async changeName(req: Request, res: Response){
    try {
        const {name} = req.body
        console.log(req.user);
        console.log(req.body);
        
        
        let acc 
        if(req.user?.type == 'users'){
            acc = await prisma.user.update({
                where: {
                    id: req.user?.id
                },
                data: {
                    name
                }
            })
        }
        if(req.user?.type == "promotors"){
            acc = await prisma.promotor.update({
                where: {
                    id: req.user?.id
                },
                data: {
                    name
                }
            })
        }
        res.status(200).send({
            status: 'ok',
            message: 'name changed',
            acc
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
    }
  }
  async changeEmail(req: Request, res: Response){
    try {
      console.log(req.body);
      console.log(req.user);
      
        const {email} = req.body
        let acc 
        if(req.user?.type == "users"){
           acc = await prisma.user.findFirst({
            where: {
                id: req.user.id
            }
           })
           if (acc?.email == email) throw 'already using this email'
        }
        if (req.user?.type == "promotors"){
          acc = await prisma.promotor.findFirst({
            where: {
              id: req.user.id
            }
          })
          if (acc?.email == email) throw 'already using this email'
        }
        const payload = {id: req.user?.id, type: req.user?.type, email}
        const token = sign(payload, process.env.KEY_JWT!, {expiresIn: '10m'})
        const link = `http://localhost:3000/verify/${token}`
        const templatePath = path.join(__dirname, "../templates", "register.html")
        const templateSource = fs.readFileSync(templatePath, 'utf-8')
        const compiletemplate = Handlebars.compile(templateSource)
        const html = compiletemplate({
            name: acc?.name,
            link
        })
        await transporter.sendMail({
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Verify new Email',
            html
        })
        res.status(200).send({
            status: 'ok',
            message: 'email send',
            token
        })
    } catch (error) {
        res.status(400).send({
            status: 'error',
            message: error
        })
    }
  }
  async verifyEmail(req: Request, res: Response){
    try {
        try {
            if(req.user?.type == 'users'){
                await prisma.user.update({
                    where: {
                        id: req.user.id
                    },
                    data: {
                        email: req.user.email
                    }
                })
            }
            if(req.user?.type == 'promotors'){
              await prisma.promotor.update({
                where: {
                  id: req.user.id
                },
                data: {
                  email: req.user.email
                }
              })
            }
            res.status(200).send({
                status: 'ok',
                message: 'email changed'
            })
        } catch (error) {
            res.status(200).send({
                status: 'ok',
                message: 'email changed'
            })
        }
    } catch (error) {
        console.log(error);
        
    }
  }
  async changePass(req: Request, res: Response){
    try {
      const { password, newPass} = req.body
      if (req.user?.type == 'users'){
        const checkPass = await prisma.user.findFirst({
          where: {
            id: req.user.id,
          }
        })
        if ( checkPass == null ) throw 'acc not found'
        const isValidPass = await compare(password, checkPass.password) 
        const isSamePass = await compare(newPass, checkPass.password)
        if (isValidPass == false) throw 'incorrect password'
        if (isSamePass == true) throw 'password should not be the same'
        if (isValidPass) {
          const salt = await genSalt(10)
          const hashPassword = await hash(newPass, salt)
          await prisma.user.update({
            data: {
              password: hashPassword
            },
            where: {
              id: req.user.id
            }
          })
          return res.status(200).send({
            status: 'ok',
            message: 'password changed'
          })
        }
      }
      if(req.user?.type == 'promotors'){
        const checkPass = await prisma.promotor.findFirst({
          where: {
            id: req.user.id
          }
        })
        if ( checkPass == null ) throw 'acc not found'
        const isValidPass = await compare(password, checkPass.password) 
        const isSamePass = await compare(newPass, checkPass.password)
        if (isValidPass == false) throw 'incorrect password'
        if (isSamePass == true) throw 'password should not be the same'
        if (isValidPass) {
          const salt = await genSalt(10)
          const hashPassword = await hash(newPass, salt)
          await prisma.promotor.update({
            data: {
              password: hashPassword
            },
            where: {
              id: req.user.id
            }
          })
          return res.status(200).send({
            status: 'ok',
            messsage: 'password changed'
          })
        }
      }
    } catch (error) {
      res.status(400).send({
        status: 'error',
        message: error
      })
    }
  }
}

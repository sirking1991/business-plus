import AppLayout from '@/layouts/app-layout';
import { Form, Head, useForm } from '@inertiajs/react';
import useCan from '@/hooks/use-can';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save } from 'lucide-react';

export default function UsersCreate() {
    const can = useCan();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Users', href: '/admin/users' }, { title: 'Create', href: '/admin/users/create' }]}>
            <Head title="Create User" />

            <div className="w-full mx-auto p-4">
                {/* Sticky Action Bar */}
                <div className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-background/80 supports-[backdrop-filter]:backdrop-blur">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Create User</h1>
                            <p className="text-sm text-gray-600 mt-1">Add user information and set credentials</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => window.history.back()}>
                                <ArrowLeft className="h-4 w-4" /> Back
                            </Button>
                            {can('user.add') && (
                                <Button form="user-create-form" type="submit" size="sm" disabled={processing}>
                                    <Save className="h-4 w-4" /> {processing ? 'Saving…' : 'Save'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-xl">User Details</CardTitle>
                        <CardDescription>Basic information and account settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form id="user-create-form" onSubmit={submit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter full name"
                                        aria-invalid={!!errors.name}
                                        className="h-11 rounded-lg"
                                    />
                                    {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address <span className="text-destructive">*</span></Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Enter email address"
                                        aria-invalid={!!errors.email}
                                        className="h-11 rounded-lg"
                                    />
                                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Enter password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password}
                                        className="h-11 rounded-lg"
                                    />
                                    {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm password"
                                        autoComplete="new-password"
                                        aria-invalid={!!errors.password_confirmation}
                                        className="h-11 rounded-lg"
                                    />
                                    {errors.password_confirmation && (
                                        <p className="text-destructive text-xs mt-1">{errors.password_confirmation}</p>
                                    )}
                                </div>
                            </div>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
